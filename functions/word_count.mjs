export const reading_time = async (words) =>{
    const words_split = words.split(/\s|\n/)
    const words_count = words_split.length
    //console.log(words_count)
    const read_time = words_count/120
    return Math.round(read_time)
}