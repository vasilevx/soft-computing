import "./App.css";
import { useState } from "react";
import Electre from "./labs/1_Electre";

const labs = [
  { label: "Метод ранжирования альтернатив ELECTRE", component: Electre },
  // {
  //   label: "Многокритериальное ранжирование альтернатив",
  //   component: () => "lab2",
  // },
  // {
  //   label: "Многокритериальный выбор альтернатив методом анализа иерархий",
  //   component: () => "lab3",
  // },
];

function App() {
  const [currentLab, setCurrentLab] = useState(labs[0]);
  const LabComponent = currentLab.component;

  const onLinkClick = (e, lab) => {
    e.preventDefault();
    setCurrentLab(lab);
  };

  return (
    <div className="App">
      <ul>
        {labs.map((lab) => (
          <li key={lab.label}>
            <a
              style={{ fontWeight: lab === currentLab ? "bold" : "normal" }}
              href="#"
              onClick={(e) => onLinkClick(e, lab)}
            >
              {lab.label}
            </a>
          </li>
        ))}
      </ul>
      <LabComponent />
    </div>
  );
}

export default App;
