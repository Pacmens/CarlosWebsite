import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import {
  CollectionIcon,
  HomeIcon,
  IdentificationIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";

const activeStyle = "bg-pink-200";

type StyledLinkProps = {
  active?: boolean;
  href: string;
};

const MenuLink = ({
  href,
  active,
  children,
}: PropsWithChildren<StyledLinkProps>) => (
  <Link href={href}>
    <a
      className={`py-2 px-4 rounded-lg flex items-center ${
        active && activeStyle
      }`}
    >
      {children}
    </a>
  </Link>
);

const Menu = () => {
  const router = useRouter();
  return (
    <aside className="flex flex-col m-2">
      <MenuLink href="/" active={router.pathname === "/"}>
        <HomeIcon className="w-6 h-6 mr-2" /> Dashboard
      </MenuLink>
      <MenuLink href="/rooms" active={router.pathname === "/rooms"}>
        <CollectionIcon className="w-6 h-6 mr-2" />
        Rooms
      </MenuLink>
      <MenuLink href="/about" active={router.pathname === "/about"}>
        <IdentificationIcon className="w-6 h-6 mr-2" />
        About
      </MenuLink>
    </aside>
  );
};
export default Menu;
