import "../app/globals.css";
import { CallProvider } from "../components/CallProvider";

export default function App({ Component, pageProps }) {
  return (
    <CallProvider>
      <Component {...pageProps} />
    </CallProvider>
  );
}
