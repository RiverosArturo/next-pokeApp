import { useCallback, useEffect, useState } from "react";

import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { Button, Card, Container, Grid, Image, Text } from "@nextui-org/react";

import confetti from "canvas-confetti";

import { Layout } from "@/components/layouts";
import { pokeApi } from "@/api";
import { Pokemon, PokemonListResponse } from "@/interfaces";
import { getPokemonInfo, localFavorites } from "@/utils";

interface Props {
  pokemon: Pokemon;
}

const PokemonByNamePage: NextPage<Props> = ({ pokemon }) => {
  // const router = useRouter();
  // console.log(router.query);
  // console.log(pokemon);

  const [isInFavorites, setIsInFavorites] = useState(false);

  const onToggleFavorite = useCallback(() => {
    localFavorites.toggleFavorite(pokemon.id);
    setIsInFavorites(!isInFavorites);

    if (isInFavorites) return;

    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      angle: -100,
      origin: {
        x: 0.5,
        y: 0,
      },
    });
  }, [isInFavorites, pokemon.id]);

  useEffect(() => {
    setIsInFavorites(localFavorites.existInFavorites(pokemon.id));
  }, [pokemon.id]);

  return (
    <Layout title={pokemon.name}>
      <Grid.Container css={{ marginTop: "5px" }} gap={2}>
        <Grid xs={12} sm={4}>
          <Card isHoverable css={{ padding: "30px" }}>
            <Card.Body>
              <Card.Image
                src={
                  pokemon.sprites.other?.dream_world.front_default ||
                  "/no-image.png"
                }
                alt={pokemon.name}
                width="100%"
                height="200px"
              />
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} sm={8}>
          <Card>
            <Card.Header
              css={{ display: "flex", justifyContent: "space-between" }}
            >
              <Text h1 transform="capitalize">
                {pokemon.name}
              </Text>
              <Button
                color="gradient"
                ghost={!isInFavorites}
                onPress={onToggleFavorite}
              >
                {isInFavorites ? "En favoritos" : "Guardar en favoritos"}
              </Button>
            </Card.Header>
            <Card.Body>
              <Text size={30}>Strites:</Text>

              <Container direction="row" display="flex" gap={0}>
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.back_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.front_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.back_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const { data } = await pokeApi.get<PokemonListResponse>("pokemon?limit=448");
  const pokemonNames: string[] = data.results.map((pokemon) => pokemon.name);
  //se ejecuta del lado del servidor
  // console.log(pokemonNames);
  return {
    paths: pokemonNames.map((name) => ({
      params: { name },
    })),
    //usamos false para que si la persona busca un id que no este en la lista de arriba nos de un error 404.
    // fallback: false,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  //Recibimos los parametros de getStaticPaths y pasan a getStaticProps
  // console.log(ctx.params);
  //Obtenemos nuestro id
  const { name } = ctx.params as { name: string };
  const pokemon = await getPokemonInfo(name);

  if (!pokemon) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      pokemon,
    },
    revalidate: 86400,
  };
};

export default PokemonByNamePage;
