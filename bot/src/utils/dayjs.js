import dayjs from 'dayjs'
import 'dayjs/locale/ru.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)
dayjs.locale('ru')

export default dayjs
