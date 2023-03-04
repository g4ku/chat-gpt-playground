import React from "react";
import { Container, Flex } from "@chakra-ui/react";
import * as styles from "./styles";

type ContainerProps = {
  rightContent?: React.ReactNode;
  children: React.ReactNode;
};

const MainContainer: React.FC<ContainerProps> = (props) => {
  return (
    <Container maxW="container.lg" height="100%" p="0">
      <Flex justify="space-between" align="center" p="0 10px">
        <header css={styles.header}>
          <h1 css={styles.title}>ChatGPT Playground</h1>
        </header>
        <div>{props.rightContent}</div>
      </Flex>

      {props.children}
    </Container>
  );
};

export default MainContainer;
