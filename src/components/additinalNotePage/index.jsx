import React from "react";
import BillingCard from "../internalComponents/billingCard";
import EventNotesCard from "../internalComponents/eventNotesCard";

export default function AdditinalNotes() {
  return (
    <div>
      <div className="AdditinalNotesPageContainer">
        <div className="notesCard">
          <EventNotesCard />
        </div>
        <div className="billingCard">
          <BillingCard />
        </div>
      </div>
    </div>
  );
}
