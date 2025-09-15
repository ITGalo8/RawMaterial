import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import "./Dashboard.css";

const SimpleCard = ({
  backgroundColor,
  title,
  content,
  quantity,
  subContent,
  onMoreInfo,
}) => (
  <div className="card" style={{ backgroundColor }}>
    <div className="card-header">
      <h2>{title}</h2>
      {onMoreInfo && (
        <button className="more-info-button" onClick={onMoreInfo}>
          More Info
        </button>
      )}
    </div>
    <div className="card-content">
      <p>{content}</p>
      <h3>{quantity}</h3>
      {subContent && <p className="sub-content">{subContent}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [rejectedData, setRejectedData] = useState(null);
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const itemTypes = [
    { title: "Pump", color: "#ffd438" },
    { title: "Controller", color: "#ffd438" },
    { title: "Motor", color: "#ffd438" },
  ];

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const defectiveResponse = await Api.get(
        "/admin/showDefectiveItemsOfWarehouse"
      );
      setData(defectiveResponse.data.data);

      const serviceResponse = await Api.get(
        "/admin/showOverallServiceData?isRepaired=1"
      );
      setServiceData(serviceResponse.data);

      const rejectedResponse = await Api.get(
        "/admin/showOverallServiceData?isRepaired=0"
      );
      setRejectedData(rejectedResponse.data);

      const productionResponse = await Api.get("/admin/showProductionSummary");
      setProductionData(productionResponse.data);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || "Unknown error";
      setError(errMsg);
      if (retryCount < 3) {
        setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, [retryCount]);

  const handleMoreInfo = (itemType) => {
    navigate("/AllDefective", { state: { itemType } });
  };

  if (loading && retryCount === 0) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error && retryCount >= 3) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>Failed to load dashboard data: {error}</p>
          <button
            onClick={() => {
              setRetryCount(0);
              fetchAllData();
            }}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1 className="dashboard-heading">Raw Material</h1> {/* Heading */}
        <div className="cards-container">
          {serviceData && (
            <div className="card-wrapper">
              <SimpleCard
                backgroundColor="#ffd438"
                title="Repaired Items"
                content={`Total: ${serviceData.total}`}
                quantity={`Monthly: ${serviceData.monthly}`}
                subContent={`Weekly: ${serviceData.weekly} | Daily: ${serviceData.daily}`}
              />
            </div>
          )}

          {rejectedData && (
            <div className="card-wrapper">
              <SimpleCard
                backgroundColor="#ffd438"
                title="Rejected Items"
                content={`Total: ${rejectedData.total}`}
                quantity={`Monthly: ${rejectedData.monthly}`}
                subContent={`Weekly: ${rejectedData.weekly} | Daily: ${rejectedData.daily}`}
              />
            </div>
          )}

          {productionData && (
            <div className="card-wrapper">
              <SimpleCard
                backgroundColor="#ffd438"
                title="Total Production"
                content={`Total: ${productionData.total}`}
                quantity={`Monthly: ${productionData.monthly}`}
                subContent={`Weekly: ${productionData.weekly} | Daily: ${productionData.daily}`}
              />
            </div>
          )}

          {itemTypes.map(({ title, color }) => {
            const itemData = data?.totalsByGroup?.find(
              (item) => item.item === title
            );
            return (
              <div className="card-wrapper" key={title}>
                <SimpleCard
                  backgroundColor={color}
                  title={title}
                  content="Total Defective"
                  quantity={itemData?.defectiveCount || 0}
                  onMoreInfo={() => handleMoreInfo(title)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
