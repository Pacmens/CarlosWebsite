import AppBar from "./AppBar";
import Menu from "./Menu";

const Layout: React.FC = ({ children }) => (
  <div className="">
    <AppBar />
    <div className="flex">
      <div className="flex-1">
        <Menu />
      </div>
      <div className="flex-[4]">
        <main>{children}</main>
      </div>
    </div>
  </div>
);

export default Layout;
