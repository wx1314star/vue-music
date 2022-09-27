import { get, post, put, del } from "./http";

/*登录相关 */
//登录请求
export const getLoginStatus = params => post(`admin`, params);

/*歌手相关 */
//查询歌手
export const getSingerAll = () => get(`singer/findAll`);

//添加歌手
export const setSinger = params => post(`singer/add`, params);

//修改歌手
export const updateSinger = params => put(`singer/update`, params);

//删除歌手
export const deleteSinger = id => del(`singer/delete?id=${id}`);

/*歌曲相关 */
//查询歌曲
export const getSongAll = () => get(`song/findAll`);

//根据歌手查询歌曲
export const getSongBySinger = id =>
  get(`song/getSongBySingerId?singerId=${id}`);

//根据歌曲ID查询歌曲
export const getSongBySonger = id =>
  get(`song/id=${id}`);

//根据歌曲名获取歌曲对象
export const getSongBySongName = name =>
  get(`song/getSongByName?songName=${name}`);

//修改歌曲
export const updateSong = params => put(`song/updateSong`, params);

//删除歌曲
export const deleteSong = id => del(`song/delete?id=${id}`);

/*歌单相关 */
//添加歌单
export const setSongList = params => post(`songList/addSongList`, params);

//查询歌单
export const getSongListAll = () => get(`songList/findAll`);

//修改歌单
export const updateSongList = params => put(`songList/updateSongList`, params);

//删除歌单
export const deleteSongList = id => del(`songList/deleteSongList?id=${id}`);

//歌单歌曲相关
//根据歌单ID查询相关歌曲
export const listSongDetail = (id) => get(`listSong/getSongBySongListId?songListId=${id}`);
//给歌单增加歌曲
export const addListSong = params => post(`listSong/add`, params);
//删除歌曲
export const deleteListSong = id => del(`listSong/delete?id=${id}`);

//用户相关
//查询所有用户
export const getConsumerAll = () => get(`consumer/findAll`);

//添加用户
export const setConsumer = params => post(`consumer/add`, params);

//修改用户
export const updateConsumer = params => put(`consumer/update`, params);

//删除用户
export const deleteConsumer = id => del(`consumer/delete?id=${id}`);