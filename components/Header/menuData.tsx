import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "노블 홈",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "나의 노블",
    newTab: false,
    path: "/mynovel",
  },
  {
    id: 3,
    title: "노블 만들기",
    newTab: false,
    path: "/create",
  },
  {
    id: 4,
    title: "노블 마켓",
    newTab: false,
    path: "/makret",
  },
  {
    id: 5,
    title: "노블 커뮤니티",
    newTab: false,
    path: "/community",
  },
  {
    id: 6,
    title: "멤버쉽",
    newTab: false,
    path: "/membership",
  },

  //   {
  //     id: 3,
  //     title: "Pages",
  //     newTab: false,
  //     submenu: [
  //       {
  //         id: 31,
  //         title: "Blog Grid",
  //         newTab: false,
  //         path: "/blog",
  //       },
  //       {
  //         id: 34,
  //         title: "Sign In",
  //         newTab: false,
  //         path: "/auth/signin",
  //       },
  //       {
  //         id: 35,
  //         title: "Sign Up",
  //         newTab: false,
  //         path: "/auth/signup",
  //       },
  //       {
  //         id: 35,
  //         title: "Docs",
  //         newTab: false,
  //         path: "/docs",
  //       },
  //       {
  //         id: 35.1,
  //         title: "Support",
  //         newTab: false,
  //         path: "/support",
  //       },
  //       {
  //         id: 36,
  //         title: "404",
  //         newTab: false,
  //         path: "/error",
  //       },
  //     ],
  //   },

  {
    id: 7,
    title: "프로필",
    newTab: false,
    path: "/profile",
  },
];

export default menuData;
