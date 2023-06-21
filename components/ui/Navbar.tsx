// import Link from "next/link";
import { Link, Spacer, Text, useTheme } from "@nextui-org/react";
import Image from "next/image";

export const Navbar = () => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "start",
        padding: "0px 20px",
        backgroundColor: theme?.colors.gray100.value,
      }}
    >
      <Image
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
        alt="icono de la app"
        width={100}
        height={100}
        priority={true}
      />
      {/* <NextLink href={"/"} passHref legacyBehavior> */}
      <Link href="/">
        <Text color="white" h1>
          P
        </Text>
        <Text color="white" h3>
          okémon
        </Text>
      </Link>

      {/* Manda a favoritos al final */}
      <Spacer css={{ flex: 1 }} />
      {/* <NextLink href={"/favorites"} passHref legacyBehavior> */}
      <Link href="/favorites">
        <Text color="white">Favorite</Text>
      </Link>
      {/* </NextLink> */}
    </div>
  );
};
