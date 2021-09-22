import { useState } from "react";
import "./Electre.css";

const Grades = {
  BAD: 0.25,
  PASSABLY: 0.5,
  GOOD: 0.75,
  PERFECT: 1,
};

const KsLabels = [
  "оценка программного обеспечения (баллы)",
  "срок гарантийного обслуживания (лет)",
  "вес образца (чем легче, тем лучше) (усл. ед)",
  "объем памяти (чем больше, тем лучше) (усл. ед)",
];

const defaultKs = [0.3, 0.15, 0.25, 0.3];
const defaultAlternatives = [
  [Grades.Good, 4, 45, 70],
  [Grades.BAD, 3, 30, 110],
  [Grades.GOOD, 5, 50, 80],
  [Grades.PASSABLY, 4.5, 30, 100],
  [Grades.PERFECT, 3.5, 50, 90],
];

const getGradeLabel = (num) => {
  switch (num) {
    case Grades.BAD:
      return "плохо";
    case Grades.PASSABLY:
      return "удовлетворительно";
    case Grades.GOOD:
      return "хорошо";
    case Grades.PERFECT:
      return "отлично";
  }
};

const parseFloatOrZero = (str) =>
  isNaN(parseFloat(str)) ? 0 : parseFloat(str);

const mapAlternatives = (alternatives) => {
  return alternatives.map((nums) => {
    return nums.map((num, i) => {
      // Критерий #3: вес образца чем меньше, тем лучше
      if (i === 2) {
        return -num;
      }

      return num;
    });
  });
};

const sumArr = (nums) =>
  nums.reduce((c, num) => {
    return c + num;
  }, 0);

const computeElectre = (alternatives, Ks) => {
  const L = Ks.map((_, i) => {
    let minK = Infinity;
    let maxK = -Infinity;

    alternatives.forEach((a) => {
      minK = Math.min(a[i], minK);
      maxK = Math.max(a[i], maxK);
    });

    return maxK - minK;
  });

  const b = [];
  const s = [];
  for (let i = 0; i < alternatives.length; i++) {
    b.push([]);
    s.push([]);

    for (let j = 0; j < alternatives.length; j++) {
      if (i === j) {
        b[i][j] = null;
        s[i][j] = null;
        continue;
      }

      let positiveSum = 0;
      const negatives = [];
      for (let k = 0; k < Ks.length; k++) {
        if (alternatives[i][k] >= alternatives[j][k]) {
          positiveSum += Ks[k];
        } else {
          negatives.push(
            Math.abs(alternatives[i][k] - alternatives[j][k]) / L[k]
          );
        }
      }

      b[i][j] = positiveSum / sumArr(Ks);

      s[i][j] = negatives.length ? Math.max(...negatives) : 0;
    }
  }

  const sorted = Object.keys(alternatives)
    .map((key) => parseInt(key))
    .sort((a1, a2) => {
      if (b[a1][a2] > b[a2][a1]) {
        return 1;
      }

      if (b[a1][a2] < b[a2][a1]) {
        return -1;
      }

      return 0;
    })
    .sort((a1, a2) => {
      if (s[a1][a2] > s[a2][a1]) {
        return -1;
      }

      if (s[a1][a2] < s[a2][a1]) {
        return 1;
      }

      return 0;
    })
    .reverse();

  return sorted;
};

const Electre = () => {
  const [Ks, setKs] = useState(defaultKs);
  const [alternatives, setAlternatives] = useState(defaultAlternatives);

  const [sortedAlternatives, setSortedAlternatives] = useState(null);

  const changeAlternative = (indx, k_indx, n) => {
    setAlternatives(
      alternatives.map((a, i) => {
        if (indx === i) {
          return a.map((aNumber, j) => {
            if (j === k_indx) {
              return n;
            }

            return aNumber;
          });
        }

        return a;
      })
    );
  };

  const changeK = (i, n) =>
    setKs(
      Ks.map((k, indx) => {
        console.log(n);
        if (i === indx) {
          return n;
        }

        return k;
      })
    );

  return (
    <div>
      <p>
        Задание: Упорядочить (ранжировать) альтернативы по мере убывания их
        приоритетности способом ELECTRE
      </p>
      <table>
        <thead>
          <tr>
            <td rowSpan={2}>Kритерий/ коэффициент важности</td>
            <td colSpan={alternatives.length}>Альтернативы</td>
          </tr>
          <tr>
            {alternatives.map((_, i) => (
              <td key={i}>
                a<sub>{i + 1}</sub>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {Ks.map((k, i) => (
            <tr key={i}>
              <td>
                {KsLabels[i]} K<sub>{i + 1}</sub> /<br />
                <input
                  type="number"
                  value={k}
                  onChange={(e) => changeK(i, parseFloatOrZero(e.target.value))}
                />
              </td>
              {alternatives.map((a, j) => (
                <td key={j}>
                  {i === 0 ? (
                    <select
                      value={a[i]}
                      onChange={(e) =>
                        changeAlternative(
                          j,
                          i,
                          parseFloatOrZero(e.target.value)
                        )
                      }
                    >
                      {Object.values(Grades).map((n) => (
                        <option key={n} value={n}>
                          {getGradeLabel(n)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={a[i]}
                      onChange={(e) =>
                        changeAlternative(
                          j,
                          i,
                          parseFloatOrZero(e.target.value)
                        )
                      }
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <input
        type="button"
        value="Ранжировать"
        onClick={() =>
          setSortedAlternatives(
            computeElectre(mapAlternatives(alternatives), Ks)
          )
        }
      />
      {sortedAlternatives && (
        <div>
          <p>
            Альтернативы, отсортированные в порядке убывания приоритетности:
          </p>
          <ol>
            {sortedAlternatives.map((number) => (
              <li key={number}>
                <b>
                  a<sub>{number + 1}</sub>
                </b>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
export default Electre;
