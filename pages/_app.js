import { CallProvider } from "../components/CallProvider";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <CallProvider>
      <Component {...pageProps} />
    </CallProvider>
  );
}
