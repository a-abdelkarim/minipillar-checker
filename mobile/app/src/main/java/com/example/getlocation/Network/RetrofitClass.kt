package com.example.getlocation.Network

import android.content.Context
import com.example.recipe_android_app.Network.ApiInterface
import com.example.recipe_android_app.Utils.Constant
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClass {

//    private fun getInstance(): Retrofit{
//        return Retrofit.Builder()
//            .baseUrl(Constant.BASE_URL)
//            .addConverterFactory(ScalarsConverterFactory.create())
//            .build()
//    }
//
//    val apiInterface: ApiInterface = getInstance().create(ApiInterface::class.java)

//    private lateinit var apiService: ApiInterface

//    fun getApiService(context: Context): ApiInterface {
//
//        // Initialize ApiService if not initialized yet
//        if (!::apiService.isInitialized) {
//            val retrofit = Retrofit.Builder()
//                .baseUrl(Constant.BASE_URL)
//                .addConverterFactory(GsonConverterFactory.create())
//                .client(okhttpClient(context)) // Add our Okhttp client
//                .build()
//
//            apiService = retrofit.create(ApiInterface::class.java)
//        }
//
//        return apiService
//    }

//    lateinit var context: Context

    private val retrofit by lazy  {
        Retrofit.Builder()
            .baseUrl(Constant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    val apiInterface: ApiInterface by lazy {
        retrofit.create(ApiInterface::class.java)
    }

//    private val okHttpClient by lazy (){
//        OkHttpClient.Builder()
//            .addInterceptor(AuthInterceptor(context))
//            .build()
//    }
    private fun okhttpClient(context: Context): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(context))
            .build()
    }

}