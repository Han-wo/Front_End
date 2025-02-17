import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import useEscapeKey from "@/hooks/use-escape-key";
import useOnClickOutside from "@/hooks/use-onclick-outside";
import ArrowDownIcon from "@/icons/arrow-down.svg";
import cn from "@/utils/cn";

interface DropdownContextType {
  isOpen: boolean;
  selectedValue: string | number;
  toggleDropdown: () => void;
  closeDropdown: () => void;
  selectedItem: (value: string | number) => void;
}

const DropdownContext = createContext<DropdownContextType>({
  isOpen: false,
  selectedValue: "",
  toggleDropdown: () => {},
  closeDropdown: () => {},
  selectedItem: () => {},
} as DropdownContextType);

interface DropdownProps {
  children: ReactNode;
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  className?: string;
}

export default function Dropdown({
  children,
  selectedValue,
  onSelect,
  className,
}: DropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const selectedItem = useCallback(
    (value: string | number) => {
      onSelect(value);
      closeDropdown();
    },
    [onSelect, closeDropdown],
  );

  const providerValue = useMemo(
    () => ({
      isOpen,
      selectedValue,
      toggleDropdown,
      closeDropdown,
      selectedItem,
    }),
    [isOpen, selectedValue, toggleDropdown, closeDropdown, selectedItem],
  );

  useOnClickOutside(dropdownRef, closeDropdown);
  useEscapeKey(closeDropdown, isOpen);

  return (
    <DropdownContext.Provider value={providerValue}>
      <div ref={dropdownRef} className={cn("relative", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function Toggle({
  children,
  border = true,
  className,
}: {
  children?: ReactNode;
  border?: boolean;
  className?: string;
}): JSX.Element {
  const { toggleDropdown, selectedValue, isOpen } = useContext(DropdownContext);

  return (
    <button
      type="button"
      className={cn(
        "mb-4 flex w-full items-center justify-between rounded-2 text-left",
        {
          "border border-solid border-gray-100 p-13": border === true,
        },
        className,
      )}
      onClick={toggleDropdown}
      aria-expanded={isOpen}
    >
      {children || selectedValue}
      <ArrowDownIcon
        className={cn(
          "fill-black transition-transform duration-300",
          isOpen ? "animate-rotate-in rotate-180" : "animate-rotate-out",
        )}
      />
    </button>
  );
}

function Wrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  const { isOpen } = useContext(DropdownContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "absolute z-50 w-full border border-solid border-gray-100 bg-white p-8 rounded-2 shadow-custom custom-scrollbar",
            className,
          )}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ItemProps {
  children: ReactNode;
  value: string | number;
  className?: string;
}

function Item({ children, value, className }: ItemProps): JSX.Element {
  const { selectedItem, selectedValue } = useContext(DropdownContext);
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      className={cn(
        "whitespace-nowrap transition-linear text-black/80 rounded-2 relative w-full py-10 px-8 text-left hover:bg-gray-100 focus:bg-green-700/5 focus:!text-green-900",
        {
          "bg-green-500/10 !text-green-900": isSelected,
        },
        className,
      )}
      onClick={() => selectedItem(value)}
      tabIndex={0}
    >
      {children}
    </button>
  );
}

Dropdown.Toggle = Toggle;
Dropdown.Wrapper = Wrapper;
Dropdown.Item = Item;
