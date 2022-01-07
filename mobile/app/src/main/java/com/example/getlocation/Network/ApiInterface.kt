package com.example.recipe_android_app.Network

import com.example.getlocation.LocationData
import retrofit2.Response
import retrofit2.http.*
import java.util.*

interface ApiInterface {

    @FormUrlEncoded
    @POST("locations")
    suspend fun submit(
        @Field("lat") lat: String,
        @Field("lng") lng: String,
        @Field("alt") alt: String,
        @Field("createdAt") createdAt: Date
    ): Response<LocationData>

//    @GET("verification")
//    fun verfiy(
//        @Header("Authorization") token: String
//    ): Response<Body>
}