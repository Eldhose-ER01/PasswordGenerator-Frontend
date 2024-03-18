import { useEffect, useState } from "react";
import "./Form.css";
import axios from "axios";

export default function Form() {
  const allowedLengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const initialValue = {
    length: "",
    uppercase: false,
    lowercase: false,
    symbol: false,
    number: false,
  };
  const [selectType, NotSelect] = useState();
  const [password, setPassword] = useState("");
  const [Slectlength, NotLength] = useState();
  const [values, setValues] = useState(initialValue);
  const handleChange = (e) => {
    const { type, checked, value, name } = e.target;
    let newValue;

    if (type === "checkbox") {
      newValue = checked;
    } else if (name === "length") {
      newValue = allowedLengths.includes(parseInt(value.trim(), 10))
        ? value.trim()
        : "";
    } else {
      newValue = value.trim();
    }

    setValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };
  const [copyStatus, setCopyStatus] = useState("");

  const copyToClipboard = () => {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = password;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    setCopyStatus("Copied!");
    setTimeout(() => {
      setCopyStatus("");
    }, 3000);
  };
  const submitData = async () => {
    try {
      if (
        !(
          values.uppercase ||
          values.lowercase ||
          values.symbol ||
          values.number
        )
      ) {
        NotSelect("Please select a Password Type");
        setTimeout(() => {
          NotSelect("");
        }, 3000);
        return;
      }
      if (!allowedLengths.includes(parseInt(values.length, 10))) {
        NotLength("Invalid password length");
        setTimeout(() => {
          NotLength("");
        }, 3000);
        return;
      }

      const response = await axios.post("https://password-generator-backend.vercel.app/password", {
        password: values,
      });

      if (response.data.success) {
        setPassword(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <div>
      <div className="sm:mt-3 md:flex items-center justify-center min-h-screen ">
        <div className="w-full sm:w-[78%] md:w-[58%] lg:w-[38%] xl:w-[28%]  p-8 custom-shadow ">
          <div className="flex justify-center mt-5">
            <input
              type="text"
              readOnly
              placeholder="This is your Password"
              value={password}
              className="w-full sm:w-64 h-12 bg-slate-200 pl-3 text-red-800 font-semibold text-lg"
            />
            <div
              onClick={copyToClipboard}
              className={`ml-3 h-12 w-20 bg-black hover:bg-green-400 flex items-center justify-center font-bold text-white cursor-pointer ${
                copyStatus ? "bg-green-500" : ""
              }`}
            >
              {copyStatus ? "Copied!" : "Copy"}
            </div>{" "}
          </div>

          <div className="flex justify-between mt-8 sm:mt-16">
            <h1 className="font-bold text-[17px]">Password Length</h1>
            <input
              type="number"
              name="length"
              value={values.length}
              onChange={handleChange}
              className="w-16 h-10 bg-slate-300 pl-5 text-lg font-semibold"
            />
          </div>

          <div className="flex justify-between mt-3">
            <h1 className="font-bold text-[17px]">Include Uppercase Letters</h1>
            <input
              type="checkbox"
              name="uppercase"
              checked={values.uppercase}
              onChange={handleChange}
              className="w-12 h-5 bg-slate-300"
            />
          </div>
          <div className="flex justify-between mt-3">
            <h1 className="font-bold text-[17px]">Include Lowercase Letters</h1>
            <input
              type="checkbox"
              name="lowercase"
              checked={values.lowercase}
              onChange={handleChange}
              className="w-12 h-5 bg-slate-300"
            />
          </div>
          <div className="flex justify-between mt-3">
            <h1 className="font-bold text-[17px]">Include Symbols</h1>
            <input
              type="checkbox"
              name="symbol"
              checked={values.symbol}
              onChange={handleChange}
              className="w-12 h-5 bg-slate-300"
            />
          </div>
          <div className="flex justify-between mt-3">
            <h1 className="font-bold text-[17px]">Include Numbers</h1>
            <input
              type="checkbox"
              name="number"
              checked={values.number}
              onChange={handleChange}
              className="w-12 h-5 bg-slate-300"
            />
          </div>
          <div className="flex items-center justify-center mt-6">
            <button
              onClick={submitData}
              type="button"
              className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-green-300 font-semibold rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
            >
              Generate Password
            </button>
          </div>
          <h1 className="text-red-500 text-center text-lg">{selectType}</h1>
          <h1 className="text-red-500 text-center text-lg">{Slectlength}</h1>
        </div>
      </div>
    </div>
  );
}
