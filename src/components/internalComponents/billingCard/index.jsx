import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addBillingItem,
  clearBillingItems,
} from "../../../redux/slices/billingItemsSlice";
import "./index.scss";

export default function BillingCard({ isModal = false }) {
  const dispatch = useDispatch();
  const clientname = useSelector((state) => state.client.clientname);
  const ownerID = useSelector((state) => state.owner.ownerID);
  const { defaultFee, list } = useSelector((state) => state.billingItems);

  /* ---------------- MASTER LISTS ---------------- */
  const [itemTypes, setItemTypes] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [payTypeList, setPayTypeList] = useState([]);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    itemType: "",

    equipmentType: "",
    personnelType: "",
    rateType: "",

    rate: 0,
    baseRate: 0, // IMPORTANT: keeps original rate
    hours: 1,

    useFlatRate: false,
    flatRate: 0,

    value: 0,
    charge: 0,

    changeFee: false,
    changeFeeReason: "NA",
    notes: "",
    comments: "",
  });

  const isEquipment = form.itemType === "Equipment";
  const isPersonnel = form.itemType === "Personnel";

  /* ---------------- UTIL ---------------- */
  const normalize = (res) => {
    const cols = res.data.COLUMNS;
    return res.data.DATA.map((row) =>
      cols.reduce((o, c, i) => {
        o[c] = row[i];
        return o;
      }, {})
    );
  };

  /* ---------------- API CALLS ---------------- */
  useEffect(() => {
    axios
      .post("http://192.168.0.65/rest/gvRestApi/master/getBillingItems", {
        clientname,
        owner_id: ownerID,
      })
      .then((res) => setItemTypes(normalize(res)))
      .catch(console.error);
  }, [clientname, ownerID]);

  useEffect(() => {
    if (isEquipment && equipmentList.length === 0) {
      axios
        .post("http://192.168.0.65/rest/gvRestApi/master/getEquipmentList", {
          clientname,
          owner_id: ownerID,
        })
        .then((res) => setEquipmentList(normalize(res)))
        .catch(console.error);
    }
  }, [isEquipment]);

  useEffect(() => {
    if (isPersonnel && personnelList.length === 0) {
      axios
        .post("http://192.168.0.65/rest/gvRestApi/master/getPersonnelList", {
          clientname,
          owner_id: ownerID,
          dorder: "1",
        })
        .then((res) => setPersonnelList(normalize(res)))
        .catch(console.error);
    }

    if (isPersonnel && payTypeList.length === 0) {
      axios
        .post("http://192.168.0.65/rest/gvRestApi/master/getPayTypeList", {
          clientname,
        })
        .then((res) => setPayTypeList(normalize(res)))
        .catch(console.error);
    }
  }, [isPersonnel]);

  /* ---------------- AUTO CALC ---------------- */
  useEffect(() => {
    let calculated = 0;

    if (form.useFlatRate) {
      calculated = Number(form.flatRate || 0);
    } else {
      calculated = Number(form.rate || 0) * Number(form.hours || 0);
    }

    setForm((p) => ({
      ...p,
      value: calculated,
      charge: p.changeFee ? p.charge : calculated,
    }));
  }, [form.rate, form.hours, form.flatRate, form.useFlatRate, form.changeFee]);

  /* ---------------- HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------------- ADD ITEM ---------------- */
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
  };

  /* ================= UI ================= */
  return (
    <div className={`billingWrapper ${isModal ? "modalMode" : ""}`}>
      {/* LEFT */}
      <div className="billingLeft">
        <h3 className="sectionTitle">Add Billing Items</h3>

        {/* ITEM TYPE */}
        <div className="formGroup">
          <label>Item Type</label>
          <select name="itemType" value={form.itemType} onChange={handleChange}>
            <option value="">Select Item</option>
            {itemTypes.map((i) => (
              <option key={i.ITEM_TYPE} value={i.ITEM_TYPE}>
                {i.ITEM_TYPE}
              </option>
            ))}
          </select>
        </div>

        {/* EQUIPMENT */}
        {isEquipment && (
          <div className="formGroup">
            <label>Equipment Type</label>
            <select
              value={form.equipmentType}
              onChange={(e) => {
                const selected = equipmentList.find(
                  (x) => x.EQ_DESCRIPTION === e.target.value
                );

                setForm((p) => ({
                  ...p,
                  equipmentType: e.target.value,
                  rate: selected?.EQ_RATE ?? 0,
                  baseRate: selected?.EQ_RATE ?? 0,
                  flatRate: selected?.FLAT_RATE ?? 0,
                  useFlatRate: false,
                }));
              }}
            >
              {equipmentList.map((e) => (
                <option key={e.EQ_ID} value={e.EQ_DESCRIPTION}>
                  {e.EQ_DESCRIPTION}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* PERSONNEL */}
        {isPersonnel && (
          <>
            <div className="formGroup">
              <label>Personnel Type</label>
              <select
                value={form.personnelType}
                onChange={(e) => {
                  const selected = personnelList.find(
                    (x) => x.PERSONNEL_DESC === e.target.value
                  );

                  setForm((p) => ({
                    ...p,
                    personnelType: e.target.value,
                    rate: selected?.RATE_PERHOUR ?? 0,
                    baseRate: selected?.RATE_PERHOUR ?? 0,
                    flatRate: selected?.FLAT_RATE ?? 0,
                    useFlatRate: false,
                  }));
                }}
              >
                {personnelList.map((p) => (
                  <option key={p.PERSONNEL_ID} value={p.PERSONNEL_DESC}>
                    {p.PERSONNEL_DESC}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>Rate Type</label>
              <select
                value={form.rateType}
                onChange={(e) => {
                  const selected = payTypeList.find(
                    (x) => x.PAY_TYPE_NAME === e.target.value
                  );

                  setForm((p) => ({
                    ...p,
                    rateType: e.target.value,
                    rate: Number(p.baseRate) * (selected?.RATE_MULT ?? 1),
                  }));
                }}
              >
                {payTypeList.map((r) => (
                  <option key={r.PAY_TYPE_ID} value={r.PAY_TYPE_NAME}>
                    {r.PAY_TYPE_NAME}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* RATE / HOURS */}
        {(isEquipment || isPersonnel) && (
          <>
            <div className="valueChargeRow">
              <div>
                <label>Rate/hr</label>
                <input
                  type="number"
                  name="rate"
                  value={form.rate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Hours</label>
                <input
                  type="number"
                  name="hours"
                  value={form.hours}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* FLAT RATE */}
            <div className="valueChargeRow flatRateRow">
              <div className="flatRateCheck">
                <input
                  type="checkbox"
                  name="useFlatRate"
                  checked={form.useFlatRate}
                  onChange={handleChange}
                />
                <label>Flat Rate</label>
              </div>
              <div className="formGroup">
                <input type="number" value={form.flatRate} readOnly />
              </div>
            </div>
          </>
        )}

        {/* VALUE / CHARGE */}
        <div className="valueChargeRow">
          <div>
            <label>Value</label>
            <input type="number" value={form.value} readOnly />
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

        <div className="formGroup">
          <label>Change Fee Reason</label>
          <select
            name="changeFeeReason"
            disabled={!form.changeFee}
            value={form.changeFeeReason}
            onChange={handleChange}
          >
            <option>NA</option>
            <option>Special Request</option>
            <option>Manual Override</option>
          </select>
        </div>

        <div className="formGroup">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>

        <div className="formGroup">
          <label>Comments</label>
          <textarea
            name="comments"
            disabled={!form.changeFee}
            value={form.comments}
            onChange={handleChange}
          />
        </div>

        <div className="btnRow">
          <button className="addBtn" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="billingRight">
        <div className="tableHeader">
          <h3>Selected Billing Items</h3>
          <button
            className="clearBtn"
            onClick={() => dispatch(clearBillingItems())}
          >
            Clear Items
          </button>
        </div>

        <table className="billingTable">
          <tbody>
            <tr className="defaultRow">
              <td>{defaultFee.billingItem}</td>
              <td>{defaultFee.charge}</td>
              <td>{defaultFee.value}</td>
              <td>{defaultFee.changeFeeReason}</td>
            </tr>

            {list.map((item, i) => (
              <tr key={i}>
                <td>{item.itemType}</td>
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
