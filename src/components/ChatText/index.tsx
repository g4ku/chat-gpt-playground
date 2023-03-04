import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { BsSendFill, BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";

type ChatTextProps = {
  onSubmit: (text: string) => void;
  fetching: boolean;
};

type FormData = {
  inputText: string;
};

const ChatText: React.FC<ChatTextProps> = (props) => {
  const [multiline, setMultiline] = useState(false);

  const { register, handleSubmit, reset, setFocus } = useForm<FormData>();

  useEffect(() => {
    if (!props.fetching) {
      setFocus("inputText");
    }
  }, [props.fetching, setFocus]);

  const onSubmit = (data: FormData) => {
    props.onSubmit(data.inputText);
    reset();
  };

  const switchMultiline = () => {
    setMultiline(!multiline);
  };

  return (
    <Container p="10px 0">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Flex gap="5px">
          <Button colorScheme="green" variant="ghost" onClick={switchMultiline}>
            {multiline ? (
              <BsArrowsCollapse size={24} />
            ) : (
              <BsArrowsExpand size={24} />
            )}
          </Button>
          <InputGroup>
            {multiline ? (
              <Textarea {...register("inputText")} disabled={props.fetching} />
            ) : (
              <Input {...register("inputText")} disabled={props.fetching} />
            )}
          </InputGroup>
          <Button type="submit" colorScheme="green" isLoading={props.fetching}>
            <BsSendFill size={20} />
          </Button>
        </Flex>
      </form>
    </Container>
  );
};

export default ChatText;
