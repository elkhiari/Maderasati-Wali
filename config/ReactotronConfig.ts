import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

declare global {
  interface Console {
    tron: any;
  }
}

let reactotron: any = null;

if (__DEV__) {
  reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({
      name: "AnastoMed App",
    })
    .useReactNative({
      asyncStorage: false,
      networking: {
        ignoreUrls: /symbolicate/,
      },
      editor: false,
      errors: { veto: (stackFrame) => false },
      overlay: false,
    })
    .use(reactotronRedux())
    .connect();

  reactotron.clear();

  console.tron = reactotron;

  reactotron.onCustomCommand({
    command: "clear cache",
    handler: () => {
      AsyncStorage.clear();
      reactotron.display({
        name: "AsyncStorage",
        preview: "Cache cleared",
        value: "Cache has been cleared successfully",
      });
    },
    title: "Clear AsyncStorage",
    description: "Clears the entire AsyncStorage for this app",
  });
}

export default reactotron;
