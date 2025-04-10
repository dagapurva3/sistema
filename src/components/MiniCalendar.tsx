import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Text,
  HStack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

interface CalendarProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function MiniCalendar({
  initialDate = new Date(),
  onDateSelect,
}: CalendarProps) {
  const [mounted, setMounted] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const bgColor = useColorModeValue('white', 'neutralGray.800');
  const todayBgColor = useColorModeValue('primaryBlue.300', 'primaryBlue.200');
  const todayColor = useColorModeValue('white', 'neutralGray.800');
  const selectedBgColor = useColorModeValue(
    'primaryBlue.50',
    'primaryBlue.600'
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const lastDateOfPrevMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (date: Date) => {
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isSelected = (date: Date) =>
    selectedDate?.toDateString() === date.toDateString();
  const totalWeeksToDisplay = 6; // Always show 6 weeks in the grid
  const totalDaysToDisplay = totalWeeksToDisplay * 7; // 6 rows * 7 columns (days)

  return (
    <Box width="100%" p={0} bg={bgColor}>
      <VStack spacing={1} justifyContent="space-between" align="stretch">
        <HStack
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          ml="2"
        >
          <Text fontSize="sm" fontWeight="bold" textAlign="left">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>

          <HStack spacing={0}>
            <Button
              onClick={handlePrevMonth}
              size="sm"
              variant="ghost"
              aria-label="Previous month"
              borderRadius="full"
              p={0}
              bg="transparent"
              _hover={{
                bg: 'neutralGray.100',
              }}
            >
              <ChevronUpIcon boxSize={8} />
            </Button>
            <Button
              onClick={handleNextMonth}
              size="sm"
              variant="ghost"
              aria-label="Next month"
              borderRadius="full"
              p={0}
              bg="transparent"
              _hover={{
                bg: 'neutralGray.100',
              }}
            >
              <ChevronDownIcon boxSize={8} />
            </Button>
          </HStack>
        </HStack>

        <Grid
          templateColumns="repeat(7, 1fr)"
          gap={1}
          width="100%"
          justifyItems="center"
          alignItems="center"
        >
          {days.map((day, index) => (
            <Button
              key={`day-${index}`}
              w="100%"
              size="sm"
              variant="ghost"
              pointerEvents="none"
              fontSize="sm"
              fontWeight="normal"
              bg="transparent"
            >
              {day}
            </Button>
          ))}
        </Grid>

        <Grid
          templateColumns="repeat(7, 1fr)"
          gap={1}
          width="100%"
          justifyItems="center"
        >
          {Array.from({ length: firstDayOfMonth }).map((_, index) => {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth() - 1,
              lastDateOfPrevMonth - firstDayOfMonth + index + 1
            );
            return (
              <Button
                key={`prev-${index}`}
                onClick={() => handleDateClick(date)}
                size="sm"
                w="100%"
                variant="ghost"
                fontSize="xs"
                fontWeight="normal"
                borderRadius="50%"
                bg={
                  isToday(date)
                    ? todayBgColor
                    : isSelected(date)
                      ? selectedBgColor
                      : 'transparent'
                }
                color="neutralGray.500"
                _hover={{
                  bg: isToday(date) ? todayBgColor : 'neutralGray.100',
                }}
              >
                {lastDateOfPrevMonth - firstDayOfMonth + index + 1}
              </Button>
            );
          })}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              index + 1
            );
            return (
              <Button
                key={`date-${index + 1}-${date.toDateString()}`}
                onClick={() => handleDateClick(date)}
                size="sm"
                variant={isToday(date) ? 'solid' : 'ghost'}
                w="100%"
                bg={
                  isToday(date)
                    ? todayBgColor
                    : isSelected(date)
                      ? selectedBgColor
                      : 'transparent'
                }
                color={
                  isToday(date)
                    ? todayColor
                    : isSelected(date)
                      ? 'primaryBlue.300'
                      : 'inherit'
                }
                fontSize="xs"
                fontWeight="normal"
                borderRadius="50%"
                _hover={{
                  bg: isToday(date) ? todayBgColor : 'neutralGray.100',
                }}
              >
                {index + 1}
              </Button>
            );
          })}

          {Array.from({
            length: totalDaysToDisplay - (firstDayOfMonth + daysInMonth),
          }).map((_, index) => {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth() + 1,
              index + 1
            );
            return (
              <Button
                key={`next-${index}`}
                onClick={() => handleDateClick(date)}
                w="100%"
                size="sm"
                variant="ghost"
                fontSize="xs"
                fontWeight="normal"
                borderRadius="50%"
                bg={
                  isToday(date)
                    ? todayBgColor
                    : isSelected(date)
                      ? selectedBgColor
                      : 'transparent'
                }
                color="neutralGray.500"
                _hover={{
                  bg: isToday(date) ? todayBgColor : 'neutralGray.100',
                }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Grid>
      </VStack>
    </Box>
  );
}
