import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";

type DateInputProps = {
	selectedDate: Date | null;
	onDateChange: (date: Date | null) => void;
};

const DateInput: React.FC<DateInputProps> = ({
	selectedDate,
	onDateChange,
}) => {
	return (
		<DatePicker
			showIcon
			icon={<CalendarIcon />}
			selected={selectedDate}
			onChange={onDateChange}
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
			)}
			placeholderText="Enter date of event"
		/>
	);
};

export default DateInput;
