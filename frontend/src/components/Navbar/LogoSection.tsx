import { NavbarBrand, NavbarContent } from "@heroui/navbar"
import { Link } from "@heroui/link";
import { Cat } from 'lucide-react';

export const LogoSection = () => {
  return (
    <NavbarContent className="basis-1/5 sm:basis-full flex flex-col items-center">
      <NavbarBrand className="  max-w-fit">
        <Link
          className="flex justify-start items-center gap-1"
          color="foreground"
          href="/"
        >
          <Cat width={75} height={75} />
        </Link>
      </NavbarBrand>
    </NavbarContent>
  );
};
