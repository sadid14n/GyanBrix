import React from "react";

const App = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <h1 className="text-text-heading font-semibold font-heading text-5xl text-center">
        Lorem ipsum dolor sit amet.
      </h1>
      <div className="w-18 h-12 bg-accent rounded-full">
        <button className="px-5 py-2 w-full h-full">Click</button>
      </div>
      <p className="text-3xl text-text-subtle font-body text-center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
        sunt incidunt quas aspernatur et.
      </p>
    </div>
  );
};

export default App;
