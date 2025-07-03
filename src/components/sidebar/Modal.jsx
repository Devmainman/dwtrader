import ReactDOM from "react-dom";

const Modal = ({ children }) => {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center">
        <div className="pointer-events-auto">{children}</div>
      </div>,
      document.getElementById("modal-root")
    );
  };

export default Modal;
