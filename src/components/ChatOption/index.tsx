import React, { useEffect, useState } from "react";
import { Checkbox, Input, Textarea } from "@chakra-ui/react";
import * as styles from "./style";

const CHAT_OPTION_KEY = "chat-option";

type ChatOption = {
  systemRole: string;
  enableSystemRole: boolean;
  maxTokens: number;
  enableMaxTokens: boolean;
};

type ChatOptionProps = {
  updateSystemRole: (content: string) => void;
  updateMaxTokens: (token: number) => void;
};

const ChatOption: React.FC<ChatOptionProps> = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [systemRole, setSystemRole] = useState("");
  const [enableSystemRole, setEnableSystemRole] = useState(false);
  const [maxTokens, setMaxTokens] = useState(0);
  const [enableMaxTokens, setEnableMaxTokens] = useState(false);

  useEffect(() => {
    // SSRを避けて取得する
    const storedOptions = window.localStorage.getItem(CHAT_OPTION_KEY);
    if (storedOptions) {
      const option: ChatOption = JSON.parse(storedOptions);
      setSystemRole(option.systemRole || "");
      setEnableSystemRole(option.enableSystemRole || false);
      setMaxTokens(option.maxTokens || 0);
      setEnableMaxTokens(option.enableMaxTokens || false);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    saveOptions();
    if (enableSystemRole) {
      props.updateSystemRole(systemRole);
    } else {
      props.updateSystemRole("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableSystemRole]);

  useEffect(() => {
    if (!initialized) return;

    saveOptions();
    if (enableMaxTokens) {
      props.updateMaxTokens(maxTokens);
    } else {
      props.updateMaxTokens(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableMaxTokens]);

  const saveOptions = () => {
    const newOptions: ChatOption = {
      systemRole,
      enableSystemRole,
      maxTokens,
      enableMaxTokens,
    };
    window.localStorage.setItem(CHAT_OPTION_KEY, JSON.stringify(newOptions));
  };

  const handleChangeSystemRole: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = (event) => {
    const value = event.currentTarget.value;
    setSystemRole(value);
    props.updateSystemRole(value);
  };

  const handleChangeMaxTokens: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = Number(event.currentTarget.value);
    setMaxTokens(value);
    props.updateMaxTokens(value);
  };

  return (
    <>
      <div css={styles.optionBox}>
        <Checkbox
          isChecked={enableSystemRole}
          onChange={(e) => setEnableSystemRole(e.target.checked)}
        >
          system role
        </Checkbox>
        <Textarea
          value={systemRole}
          disabled={!enableSystemRole}
          onChange={handleChangeSystemRole}
          onBlur={saveOptions}
        />
      </div>

      <div css={styles.optionBox}>
        <Checkbox
          isChecked={enableMaxTokens}
          onChange={(e) => setEnableMaxTokens(e.target.checked)}
        >
          Max tokens
        </Checkbox>
        <Input
          type="number"
          value={maxTokens}
          disabled={!enableMaxTokens}
          onChange={handleChangeMaxTokens}
          onBlur={saveOptions}
        />
      </div>
    </>
  );
};

export default ChatOption;
