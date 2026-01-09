import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addBillingItem, clearBillingItems } from "../../../redux/slices/billingItemsSlice";
import "./index.scss";

export default function BillingCard({ isModal = false }) {
  const dispatch = useDispatch();
  const { defaultFee, list } = useSelector((state) => state.billingItems);

  const [itemTypes, setItemTypes] = useState([]);

  const [form, setForm] = useState({
    itemType: "",
    value: 0,
    charge: 0,
    notes: "",
    changeFee: false,
    changeFeeReason: "NA",
    comments: "",
  });

  // -------------------- API CALL --------------------
  const fetchBillingItems = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.65/rest/gvRestApi/master/getBillingItems",
        {
          clientname: "dps",
          owner_id: 1,
        }
      );

      if (response?.data?.COLUMNS && response?.data?.DATA) {
        const cols = response.data.COLUMNS;
        const rows = response.data.DATA;

        // Convert DATA → array of objects based on COLUMNS
        const formatted = rows.map((row) => {
          let obj = {};
          row.forEach((value, index) => {
            obj[cols[index]] = value;
          });
          return obj;
        });

        setItemTypes(formatted);
      }
    } catch (error) {
      console.error("Error fetching billing items:", error);
    }
  };

  useEffect(() => {
    fetchBillingItems();
  }, []);

  // -------------------- FORM CHANGE HANDLER --------------------
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 🔥 Auto-fill values when ITEM_TYPE dropdown changes
    if (name === "itemType") {
      const selected = itemTypes.find((x) => x.ITEM_TYPE === value);

      if (selected) {
        setForm((prev) => ({
          ...prev,
          value: selected.DEFAULT_VALUE ?? 0,
          charge: selected.DEFAULT_COST ?? 0,
        }));
      }
    }
  };

  // -------------------- ADD ITEM --------------------
  const handleAddItem = () => {
    if (!form.itemType) {
      alert("Please select Item Type");
      return;
    }

    dispatch(
      addBillingItem({
        ...form,
        value: Number(form.value),
        charge: Number(form.charge),
      })
    );

    // Reset form
    setForm({
      itemType: "",
      value: 0,
      charge: 0,
      notes: "",
      changeFee: false,
      changeFeeReason: "NA",
      comments: "",
    });
  };

  return (
    <div className={`billingWrapper ${isModal ? "modalMode" : ""}`}>
      {/* ---------------- LEFT FORM ---------------- */}
      <div className="billingLeft">
        <p>Add Billing Items</p>

        {/* ITEM TYPE */}
        <div className="formGroup">
          <label>Item Type</label>
          <select
            name="itemType"
            value={form.itemType}
            onChange={handleChange}
          >
            <option value="">Select Item</option>
            {itemTypes.map((item, idx) => (
              <option key={idx} value={item.ITEM_TYPE}>
                {item.ITEM_TYPE}
              </option>
            ))}
          </select>
        </div>

        {/* VALUE + CHARGE */}
        <div className="valueChargeRow">
          <div>
            <label>Value</label>
            <input type="number" name="value" value={form.value} readOnly />
          </div>

          <div>
            <label>Charge</label>
            <input
              type="number"
              name="charge"
              value={form.charge}
              readOnly={!form.changeFee}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* NOTES */}
        <div className="formGroup">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>

        {/* CHANGE FEE */}
        <div className="formGroup inline">
          <label>Change Fee?</label>
          <input
            type="checkbox"
            name="changeFee"
            checked={form.changeFee}
            onChange={handleChange}
          />
        </div>

        {/* CHANGE FEE REASON */}
        <div className="formGroup">
          <label>Change Fee Reason</label>
          <select
            name="changeFeeReason"
            value={form.changeFeeReason}
            disabled={!form.changeFee}
            onChange={handleChange}
          >
            <option>NA</option>
            <option>Special Request</option>
            <option>Manual Override</option>
          </select>
        </div>

        {/* COMMENTS */}
        <div className="formGroup">
          <label>Comments</label>
          <textarea
            name="comments"
            value={form.comments}
            disabled={!form.changeFee}
            onChange={handleChange}
          />
        </div>

        {/* ADD BUTTON */}
        <div className="btnRow">
          <button className="addBtn" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
      </div>

      {/* ---------------- RIGHT TABLE ---------------- */}
      <div className="billingRight">
        <div className="tableHeader">
          <h3>Selected Billing Items</h3>
          <button className="clearBtn" onClick={() => dispatch(clearBillingItems())}>
            Clear Items
          </button>
        </div>

        <p className="note">*Default facility charge is applied after schedule created</p>

        <table className="billingTable">
          <thead>
            <tr>
              <th>Billing Item</th>
              <th>Item Type</th>
              <th>Charge</th>
              <th>Value</th>
              <th>Change Fee Reason</th>
            </tr>
          </thead>

          <tbody>
            {/* DEFAULT FEE ROW */}
            <tr className="defaultRow">
              <td>{defaultFee.billingItem}</td>
              <td></td>
              <td>{defaultFee.charge}</td>
              <td>{defaultFee.value}</td>
              <td>{defaultFee.changeFeeReason}</td>
            </tr>

            {/* USER ADDED ITEMS */}
            {list.map((item, index) => (
              <tr key={index}>
                <td>{item.itemType}</td>
                <td></td>
                <td>{item.charge}</td>
                <td>{item.value}</td>
                <td>{item.changeFeeReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
