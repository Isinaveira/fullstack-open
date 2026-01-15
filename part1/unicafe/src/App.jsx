import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const Header = (props) => <h1>{props.text}</h1>;

const Counter = (props) => (
  <p>
    {props.text} {props.count}
  </p>
);

const Statistics = (props) => {
  const total = props.goodsCount + props.neutralsCount + props.badsCount;

  return (
    <>
      <Header text="Statistics" />

      {total !== 0 ? (
        <>
          <Counter text="goods" count={props.goodsCount} />
          <Counter text="neutral" count={props.neutralsCount} />
          <Counter text="bads" count={props.badsCount} />
          <Counter text="average" count={props.calculateAvg()} />
          <Counter
            text="positive"
            count={props.calculatePositivePercentage()}
          />
        </>
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

const App = () => {
  const [goodsCount, setGoodsCount] = useState(0);
  const [neutralsCount, setNeutralCount] = useState(0);
  const [badsCount, setBadsCount] = useState(0);

  const handleGoodClick = () => setGoodsCount(goodsCount + 1);
  const handleNeutralsClick = () => setNeutralCount(neutralsCount + 1);
  const handleBadsClick = () => setBadsCount(badsCount + 1);

  const calculateAvg = () => {
    const total = goodsCount + neutralsCount + badsCount;
    if (total == 0) return 0;
    return (goodsCount - badsCount) / (goodsCount + neutralsCount + badsCount);
  };

  const calculatePositivePercentage = () => {
    const total = goodsCount + neutralsCount + badsCount;
    if (total == 0) {
      return 0 + "%";
    }
    return (goodsCount / total) * 100 + "%";
  };

  return (
    <>
      <Header text="Give feedback" />
      <Button text="good" onClick={handleGoodClick}></Button>
      <Button text="neutral" onClick={handleNeutralsClick}></Button>
      <Button text="bad" onClick={handleBadsClick}></Button>
      <Statistics
        goodsCount={goodsCount}
        neutralsCount={neutralsCount}
        badsCount={badsCount}
        calculateAvg={calculateAvg}
        calculatePositivePercentage={calculatePositivePercentage}
      />
    </>
  );
};

export default App;
