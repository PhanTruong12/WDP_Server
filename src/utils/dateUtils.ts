import moment from "moment"

interface ScheduleOfBlog {
  DateValue: number,
  StartTime: Date,
  EndTime: Date
}

export const getCurrentWeekRange = () => {
  const currentDate = new Date()
  const dayOfWeek = currentDate.getDay()
  const startOfWeek = new Date(currentDate)
  const endOfWeek = new Date(currentDate)
  const adjustedDayOfWeek = (dayOfWeek === 0) ? 6 : dayOfWeek - 1
  startOfWeek.setDate(currentDate.getDate() - adjustedDayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)

  endOfWeek.setDate(currentDate.getDate() + (6 - adjustedDayOfWeek))
  endOfWeek.setHours(23, 59, 59, 999)

  return { startOfWeek, endOfWeek }
}

const getRealDateTime = (correctDate: Date, correctTime: Date) => {
  const year = correctDate.getFullYear()
  const month = correctDate.getMonth()
  const date = correctDate.getDate()
  const hours = correctTime.getHours()
  const minutes = correctTime.getMinutes()
  const seconds = correctTime.getSeconds()
  const realDateTime = new Date(year, month, date, hours, minutes, seconds)
  return realDateTime
}

export const getRealScheduleForBlog = (
  totalSlot: number,
  scheduleInWeek: ScheduleOfBlog[],
  startDate: Date
) => {
  let realSchedules = [] as any[]
  for (let i = 0; realSchedules.length < totalSlot; i++) {
    const date = moment(startDate).add(i, "days")
    const day = date.toDate().getDay()
    const dateInScheduleInWeek = scheduleInWeek.find((s: ScheduleOfBlog) => s.DateValue === day)
    if (!!dateInScheduleInWeek) {
      realSchedules.push({
        StartTime: getRealDateTime(date.toDate(), new Date(dateInScheduleInWeek.StartTime)),
        EndTime: getRealDateTime(date.toDate(), new Date(dateInScheduleInWeek.EndTime))
      })
    }
  }
  return realSchedules
}
