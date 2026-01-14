import { useState } from 'react'


const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>
}

const Header = (props) => <h1>{props.text}</h1>;

const Counter = (props) => <p>{props.text} {props.count}</p>

const App = () => {
  const [goodsCount, setGoodsCount] = useState(0);
  const [neutralsCount, setNeutralCount] = useState(0);
  const [badsCount, setBadsCount] = useState(0);

  const handleGoodClick = () =>  setGoodsCount(goodsCount + 1);
  const handleNeutralsClick = () => setNeutralCount(neutralsCount + 1);
  const handleBadsClick = () => setBadsCount(badsCount + 1);

  return (
    <>
      <Header text="Give feedback"/>
      <Button text="good" onClick={handleGoodClick}></Button>
      <Button text="neutral" onClick={handleNeutralsClick}></Button>
      <Button text="bad" onClick={handleBadsClick}></Button>
      <Header text="Statistics"/>
      <Counter text="goods" count={goodsCount}/>
      <Counter text="neutral" count={neutralsCount}/>
      <Counter text="bads" count={badsCount}/>
    </>
  )
}

export default App
