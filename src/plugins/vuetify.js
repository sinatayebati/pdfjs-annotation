import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        themes: {
            colors: {
                primary: '#1867CO',
                secondary: '#5CBBF6'
            },
        },
    },
    components: {
        VCalendar,
    },
})