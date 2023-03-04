import React from "react";
import { Box, Center, Container, Spinner, Tag } from "@chakra-ui/react";
import * as styles from "./style";

export type ChatItem = {
  role: "assistant" | "user";
  content: string;
  error?: boolean;
  token?: number;
};

type ChatViewProps = {
  items: ChatItem[];
  fetching: boolean;
};

const ChatView: React.FC<ChatViewProps> = (props) => {
  return (
    <div>
      {props.items.map((x, i) => (
        <Chat key={i} item={x} />
      ))}
      {props.fetching && (
        <Center height="35px">
          <Spinner />
        </Center>
      )}
    </div>
  );
};

type ChatProps = {
  item: ChatItem;
};

const Chat: React.FC<ChatProps> = (props) => {
  const { item } = props;
  return (
    <Container
      css={styles.chatBox}
      maxW="100%"
      p="8px 10px 5px"
      bg={item.role === "user" ? undefined : "gray.700"}
    >
      <Box w="80px" flexShrink={0}>
        <Box
          display="inline-block"
          p="0 5px"
          bg={item.role === "user" ? "blue.500" : "green.500"}
          borderRadius="5px"
        >
          {item.role}
        </Box>
      </Box>
      <Box p="2px 0 0" color={item.error ? "red" : undefined}>
        {item.error && item.role === "user" ? (
          <s>{item.content}</s>
        ) : (
          <pre css={styles.chatContent}>{item.content}</pre>
        )}
        {item.token && (
          <div style={{ marginTop: "5px" }}>
            <Tag size="sm">token: {item.token}</Tag>
          </div>
        )}
      </Box>
    </Container>
  );
};

export default ChatView;