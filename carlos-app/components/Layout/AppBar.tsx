import { HeartIcon } from "@heroicons/react/outline";

const AppBar = () => (
  <nav className=" text-pink-600 flex items-center shadow">
    <HeartIcon className="w-10 h-10 mx-2" />
    <h1 className="text-4xl m-4">Carlos</h1>
  </nav>
);

export default AppBar;
