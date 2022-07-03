import { Button, Collapsible, Stack, DatePicker } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";

interface Props {
  // handleToggle: () => void;
  // open: boolean;
  // month: number;
  // year: number;
  selectedDate: { start: Date; end: Date };
  dateToDisplay: string;
  setSelectedDate: any;
  // handleMonthChange: (month: number) => void;
}

export const DateSelector = ({
  //handleToggle,
  //open,
  // month,
  // year,
  selectedDate,
  dateToDisplay,
  setSelectedDate,
}: // handleMonthChange,
Props) => {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const [{ month, year }, setDate] = useState({
    month: (dateToDisplay.slice(5, 7) as unknown as number) - 1,
    year: dateToDisplay.slice(0, 4) as unknown as number,
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  const dateSelector = (
    <div className="date_picker">
      <Stack vertical>
        <Button
          onClick={handleToggle}
          ariaExpanded={open}
          ariaControls="basic-collapsible"
        >
          Pick Date
        </Button>
        <Collapsible
          id={"basic-collapsible"}
          open={open}
          transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        >
          <DatePicker
            month={month}
            year={year}
            onChange={setSelectedDate}
            onMonthChange={handleMonthChange}
            selected={selectedDate}
            disableDatesBefore={new Date("1995-06-16")}
            disableDatesAfter={new Date()}
          />
        </Collapsible>
      </Stack>
    </div>
  );
  return dateSelector;
};
