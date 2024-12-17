import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './components/Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/dist/locale/ar-dz'
moment.locale('ar');

const MainContent = () => {

    const availibaleCities = [
        {
            Name_ar: 'الجزائر',
            Name_Ln: 'Algiers'
        },
        {
            Name_ar: 'مستغانم',
            Name_Ln: 'Mostaganem'
        },
        {
            Name_ar: 'البليدة',
            Name_Ln: 'Blida'
        },
        {
            Name_ar: 'قسنطينة',
            Name_Ln: 'Constantine'
        },
        {
            Name_ar: 'أدرار',
            Name_Ln: 'Adrar'
        },
    ]

    const prayersNames = [
        {
            key: 'Fajr',
            DisplayName: 'الفجر'
        },
        {
            key: 'Dhuhr',
            DisplayName: 'الظهر'
        },
        {
            key: 'Asr',
            DisplayName: 'العصر'
        },
        {
            key: ' Maghrib',
            DisplayName: 'المغرب'
        },
        {
            key: 'Isha',
            DisplayName: 'العشاء'
        },
    ]
    const [timings, setTimings] = useState({
        Fajr: "",
        Dhuhr: "",
        Asr: "",
        Maghrib: "",
        Isha: ""
    })
    const [selectedCity, setSelectedCity] = useState(availibaleCities[0])
    const [dateAndTime, setDateAndTime] = useState("")
    const [nextPrayerIndex, setNextPrayerIndex] = useState(null)
    const [remainingTimeToNextPrayer, setRemainingTimeToNextPrayer] = useState('')


    const getPrayersTime = async () => {
        // axios return promise
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.Name_Ln}&country=DZ`)
        
        setTimings(response.data.data.timings)
    }

    useEffect(()=>{
        // fetch prayers times
        getPrayersTime()
        /* 
        // count down (because this is a side Effect)
        // each time the component unmount then mount, a new timer is created , and the ancient still working in the backend => kill it when unmount (how ? in the return)
        let interval = setInterval(()=>{
            setTimer((t)=>{return t-1}) // react take screenShot of the state and apply this function, so every time timer = 10
        }, 1000)

        return ()=>{
            clearInterval(interval)
        } 
        */
    }, [selectedCity])

    useEffect(()=>{
        const areTimingsFetched = Object.values(timings).every((time) => time !== "");
        if (!areTimingsFetched) return; // Skip execution if timings are not yet populated
        // set date and time
        setDateAndTime(moment().format('dddd Do MMMM YYYY | h:mm a'))
        // set countdown timer for the next prayer : 
            // 1- get what is the next prayer and what is the remaining time to it
            let interval = setInterval (()=>{
                setCountdownTimer()
            }, 1000)

        return ()=>{
            clearInterval(interval)
        }
    }, [timings])

    const setCountdownTimer = () => {
        const momentNow = moment()
        let nextPrayer = null

        // find what is the next prayer
        if (momentNow.isAfter(moment(timings.Fajr, 'HH:mm')) && momentNow.isBefore(moment(timings.Dhuhr, 'HH:mm'))) {
            nextPrayer = 1;
        } else if (momentNow.isAfter(moment(timings.Dhuhr, 'HH:mm')) && momentNow.isBefore(moment(timings.Asr, 'HH:mm'))) {
            nextPrayer = 2;
        } else if (momentNow.isAfter(moment(timings.Asr, 'HH:mm')) && momentNow.isBefore(moment(timings.Maghrib, 'HH:mm'))) {
            nextPrayer = 3;
        } else if (momentNow.isAfter(moment(timings.Maghrib, 'HH:mm')) && momentNow.isBefore(moment(timings.Isha, 'HH:mm'))) {
            nextPrayer = 4;
        } else {
            nextPrayer = 0; // Default to Fajr or handle as you prefer
        }
        setNextPrayerIndex(nextPrayer)
        
        // calculate the remaining time to the next prayer
        const prayerObject = prayersNames[nextPrayer]
        let remainingTime = moment(timings[prayerObject?.key], 'hh:mm').diff(momentNow)
        
        // I next prayer is 'Fajr' (= remainingtime<0) , change the logic of calculating the remaining time
        if(remainingTime<0) { 
            const fromNowToMidnight = moment('23:59:59', 'HH:mm:ss').diff(momentNow)
            const fromMidnightToFajr = moment(momentNow).diff(moment('00:00', 'HH:mm'))
            const totalDifference = fromNowToMidnight + fromMidnightToFajr
            remainingTime = totalDifference
        }

        const duration= moment.duration(remainingTime)
        setRemainingTimeToNextPrayer(`${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`);
          

    }

    
    const handleChange = (event) => {
        setSelectedCity(availibaleCities.find( city => city.Name_Ln === event.target.value))   
    };

    return (
        <>
            {/* Top section start*/}
                <Grid container>
                    <Grid size={6}>
                        <div>
                            <h2>{dateAndTime}</h2>
                            <h1>{selectedCity.Name_ar}</h1>
                        </div>
                    </Grid>
                    <Grid size={6}>
                        <div>
                            <h2>متبقي حتى صلاة {prayersNames[nextPrayerIndex]?.DisplayName} </h2>
                            <h1>{remainingTimeToNextPrayer}</h1>
                        </div>
                    </Grid>
                </Grid>
            {/* Top section end */}


            <Divider variant="middle" style={{borderColor: "rgba(255,255,255,0.1)"}} />

            
            {/* Prayers times section */}
                <Stack 
                direction="row" 
                justifyContent='space-around'
                flexWrap='wrap'
                gap={2}
                marginTop={4}
                >
                    <Prayer name='الفجر' time={timings.Fajr} image='https://i.pinimg.com/736x/6e/1a/d5/6e1ad507150f57559e3ac5334b3fb528.jpg' />
                    <Prayer name='الظهر' time={timings.Dhuhr} image='https://th.bing.com/th/id/OIG3.pTCizIRW5HmyX6JmsX1Q?pid=ImgGn' />
                    <Prayer name='العصر' time={timings.Asr} image='https://i.pinimg.com/736x/15/15/16/151516396ba9872bc9b63c3500058fe5.jpg' />
                    <Prayer name='المغرب' time={timings.Maghrib} image='https://i.pinimg.com/736x/56/90/9a/56909ae9c503c41488a2a8fb8eb7fde6.jpg' />
                    <Prayer name='العشاء' time={timings.Isha} image='https://media.istockphoto.com/id/176087978/photo/blue-mosque-in-ramadan.jpg?s=612x612&w=0&k=20&c=lg5J5sM6dt3IVtBk6QFmjYDBexsO6w7Al6lItdwibTA=' />
                    
                </Stack>
            {/* Prayers times section end */}




            {/* select section start */}
                <Stack
                direction='row'
                marginTop={4}
                justifyContent='center'
                >
                <FormControl style={{width: '15rem', color: 'white'}}>
                    <InputLabel id="demo-simple-select-label" style={{ color: "white"}}>المدينة</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCity.Name_Ln}
                        label="Age"
                        onChange={handleChange}
                        sx={{color: "white"}}
                    >
                        { 
                            
                            availibaleCities.map( city => {
                                return <MenuItem key={city.Name_Ln} value={city.Name_Ln}>{city.Name_ar}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                </Stack>
            {/* select section end */}
        </>
    )
}

export default MainContent