import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DetailedInfo.css";
import { useConfirm } from "material-ui-confirm";
import DetailedBids from "./DetailedBids";
export default function DetailedTenderInfo({
  tenders,
  fetchTenders,
  isCity,
  user,
}) {
  const confirm = useConfirm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const API_URL = "http://localhost:5500";

  const handleDelete = (tender) => {
    confirm({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete "${tender.tender_name}"?`,
    })
      .then(() => {
        axios
          .delete(`${API_URL}/delete_tender/${tender.tender_id}`)
          .then(async () => {
            console.log("Tender deleted successfully:");
            await fetchTenders();
            navigate("/");
          })
          .catch((error) => {
            console.error("Error deleting tender:", error);
          });
      })
      .catch(() => {
        console.log("Deletion canceled");
      });
  };

  useEffect(() => {
    const foundTender = tenders.find(
      (tender) => tender.tender_id.toString() === id
    );
    if (foundTender) {
      setTender(foundTender);
    }
  }, [tenders, id]);

  if (!tender) {
    return (
      <div className="not-found">
        <h2>Tender Details</h2>
        <p>Tender not found</p>
        <button onClick={() => navigate("/")}>Back to Tenders</button>
      </div>
    );
  }

  const isCompany = user && user.user_type == "Company";
  return (
    <div className="tender-detail">
      <h2>Tender Details</h2>
      <div className="tender-card">
        <h2>{tender.tender_name}</h2>
        <div className="detail-row">
          <p>
            <strong>ID:</strong> {tender.tender_id}
          </p>
          <p>
            <strong>Notice Date:</strong>{" "}
            {tender.date_of_tender_notice.slice(0, 16).replace("T", " ")}
          </p>
        </div>
        <div className="detail-row">
          <p>
            <strong>Description:</strong> {tender.description || "N/A"}
          </p>
          <p>
            <strong>Close Date:</strong>{" "}
            {tender.date_of_tender_close.slice(0, 16).replace("T", " ")}
          </p>
        </div>
        <div className="detail-row">
          <p>
            <strong>Term of Construction:</strong>{" "}
            {tender.construction_from.slice(0, 16).replace("T", " ")} to{" "}
            {tender.construction_to.slice(0, 16).replace("T", " ")}
          </p>
        </div>
        <div className="detail-row">
          <p>
            <strong>Estimated Tender Price:</strong> {tender.bidding_price}
          </p>
        </div>
        <div className="detail-row">
          <p>
            <strong>Status:</strong> {tender.tender_status}
          </p>
        </div>
        {(isCity || isCompany) && (
          <div className="detail-row">
            <p>
              <strong>Staff ID:</strong> {tender.staff_id}
            </p>
          </div>
        )}

        <DetailedBids tender={tender} />
        <div className="actions">
          {isCity && (
            <button
              id="update-btn"
              onClick={() => navigate(`/update-tender/${tender.tender_id}`)}
            >
              Update
            </button>
          )}
          {isCity && (
            <button id="delete-btn" onClick={() => handleDelete(tender)}>
              Delete
            </button>
          )}
          <button onClick={() => navigate("/")}>Back</button>
        </div>
      </div>
    </div>
  );
}
