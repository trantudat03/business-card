import CommonButton from "components/CommonButton";
import React from "react";
import { useEffect } from "react";
import { useBooleanStore } from "store/boolean";
import { useModalStore } from "store/modal";
import { closeApp } from "zmp-sdk";
import { Modal } from "zmp-ui";

/**
 * The modal visibility can be controlled via modalStore.
 */
const DynamicModal = () => {
  const isOpen = useBooleanStore((state) => state[DynamicModal.booleanKey]);
  const modal = useModalStore((state) => state.modal);

  useEffect(() => {
    if (modal) {
      useBooleanStore.setState({
        [DynamicModal.booleanKey]: true,
      });
    }
  }, [modal]);

  return (
    <Modal
      visible={isOpen}
      title={modal?.content ? undefined : modal?.title}
      description={modal?.content ? undefined : modal?.description}
      onClose={() => {
        if (modal?.dismissible) {
          useBooleanStore.setState({
            [DynamicModal.booleanKey]: false,
          });
        }
      }}
      className="text-center"
    >
      {modal?.content}
      {(modal?.isFatal || modal?.confirmButton) && (
        <CommonButton
          fullWidth
          variant="primary"
          className="!mt-6"
          onClick={async () => {
            if (modal?.isFatal) {
              await closeApp();
            } else {
              if (modal?.closeOnConfirm) {
                useBooleanStore.setState({
                  [DynamicModal.booleanKey]: false,
                });
              }

              await modal?.confirmButton?.onClick?.();
            }
          }}
        >
          {modal?.isFatal ? "Thoát" : modal?.confirmButton?.text ?? "Xác nhận"}
        </CommonButton>
      )}
      {modal?.cancelButton && (
        <CommonButton
          fullWidth
          variant="tertiary"
          className="!mt-4"
          onClick={async () => {
            if (modal?.closeOnCancel) {
              useBooleanStore.setState({
                [DynamicModal.booleanKey]: false,
              });
            }

            await modal?.cancelButton?.onClick?.();
          }}
        >
          {modal.cancelButton.text ?? "Hủy"}
        </CommonButton>
      )}
    </Modal>
  );
};

DynamicModal.booleanKey = "dynamicModal";

export default DynamicModal;
