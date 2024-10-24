import "bulmaswatch/superhero/bulmaswatch.min.css";

import TextEditor from "./components/text-editor";
import { store } from "./state";
import { Provider } from "react-redux";
// import CodeCell from "./components/code-cell";

function App() {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
        {/* <CodeCell /> */}
      </div>
    </Provider>
  );
}

export default App;
