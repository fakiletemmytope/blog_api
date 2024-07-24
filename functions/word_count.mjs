export const reading_time = async (words) =>{
    const words_split = words.split(/\s|\n/)
    const words_count = words_split.length
    //console.log(words_count)
    const read_time = words_count/120
    return Math.round(read_time)
}

export const timestamp =() => {
    // Create a new Date object with the current date and time
    const currentDate = new Date();

    // Create a function to pad single digit numbers with leading zeros
    const pad = (num) => (num < 10 ? "0" : "") + num;

    // Format the date and time into the desired format
    const formattedTimestamp = `${currentDate.getFullYear()}-${pad(
      currentDate.getMonth() + 1
    )}-${pad(currentDate.getDate())}T${pad(currentDate.getHours())}:${pad(
      currentDate.getMinutes()
    )}:${pad(currentDate.getSeconds())}.${currentDate.getMilliseconds()}Z`;

    return formattedTimestamp
}