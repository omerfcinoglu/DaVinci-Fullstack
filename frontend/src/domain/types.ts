import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type Post = { userId: number; id: number; title: string; body?: string };
