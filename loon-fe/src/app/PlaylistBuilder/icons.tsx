import {
  FaChevronDown,
  FaChevronRight,
  FaRegCheckSquare,
  FaRegFile,
  FaRegFolder,
  FaRegFolderOpen,
  FaRegMinusSquare,
  FaRegPlusSquare,
  FaRegSquare,
} from "react-icons/fa";

export const icons = {
  check: <FaRegCheckSquare className="rct-icon rct-icon-check" />,
  uncheck: <FaRegSquare className="rct-icon rct-icon-uncheck" />,
  halfCheck: <FaRegCheckSquare className="rct-icon rct-icon-half-check" />,
  expandClose: <FaChevronRight className="rct-icon rct-icon-expand-close" />,
  expandOpen: <FaChevronDown className="rct-icon rct-icon-expand-open" />,
  expandAll: <FaRegPlusSquare className="rct-icon rct-icon-expand-all" />,
  collapseAll: <FaRegMinusSquare className="rct-icon rct-icon-collapse-all" />,
  parentClose: <FaRegFolder className="rct-icon rct-icon-parent-close" />,
  parentOpen: <FaRegFolderOpen className="rct-icon rct-icon-parent-open" />,
  leaf: <FaRegFile className="rct-icon rct-icon-leaf-close" />,
};
