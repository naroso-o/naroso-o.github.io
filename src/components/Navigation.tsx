"use client"
import Link from "next/link"

const Navigation = () => {
  const menus = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Notes",
      href: "/notes",
    },
    {
      label: "Lab",
      href: "/lab",
    },
  ]

  return (
    <nav className="flex justify-center p-2">
      {menus.map((menu) => (
        <Link key={`menu-${menu.label}`} href={menu.href}>
          <span className="inline-flex justify-center w-fit rounded-md border border-none px-4 py-2 bg-none text-sm font-medium text-gray-700 ">
            {menu.label}
          </span>
        </Link>
      ))}
    </nav>
  )
}

export default Navigation
