const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Part = (props) => {
    return <p key={props.index}>{props.name} {props.exercises}</p>
} 

const Content = (props) => {
  return props.parts.map((part, index) => (
    <Part key={index} name={part.name} exercises={part.exercises} />
  ));
};

const Total = (props) => {
  return (
    <p>
      total of {props.parts.reduce((acc, { exercises }) => acc + exercises, 0)}
    </p>
  );
};

const Course = (props) => {
    const course = props.course;
    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    );
}

export default Course;