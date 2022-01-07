package com.example.getlocation

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.getlocation.Network.RetrofitClass
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.*

class MainViewModel : ViewModel() {

    private val TAG = "MainViewModel"
    private var _locationData = MutableLiveData<LocationData>()
    val locationData : LiveData<LocationData>
        get() = _locationData

    private var _isSuccess = MutableLiveData<Boolean>()
    val isSuccess : LiveData<Boolean>
        get() = _isSuccess

    private var _isVerified = MutableLiveData<Boolean>()
    val isVerified : LiveData<Boolean>
        get() = _isVerified

    private var _ranNumber = MutableLiveData<IntArray>()
    val ranNumber : LiveData<IntArray>
        get() = _ranNumber

    private var _timeSelected = MutableLiveData<Int>()
    val timeSelected : LiveData<Int>
        get() = _timeSelected

    var result = MutableLiveData<LocationData>()


    init {
        Log.d(TAG, "initialization: ")
        _timeSelected.value = 1
        _isVerified.value = false
        codeCreator()
    }

    fun sendLocation() {
        viewModelScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    RetrofitClass.apiInterface.submit(
                        _locationData.value!!.lat,
                        _locationData.value!!.lng,
                        _locationData.value!!.alt,
                        _locationData.value!!.createdAt
                    )
                }

                Log.d(TAG, "sendLocation: " + response.body())
                result.value = response.body()
                _isSuccess.value = true

            } catch (e: Exception) {
                Log.e("Error", e.toString())
                _isSuccess.value = false
            }
        }
    }

    fun requestVerification() {
        viewModelScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {

//                    RetrofitClass.apiInterface.verfiy(
//                        _locationData.value!!.lat
//                    )
                }
//                result.value = response.body()
                _isSuccess.value = true
                _isVerified.value = true
            } catch (e: Exception) {
                Log.e("Error", e.toString())
                _isSuccess.value = false
                _isVerified.value = false
            }
        }
    }

    fun setLocation(lat: String, lng: String, alt: String) {
        Log.d(TAG, "getLocation: " +  getCurrentDateTime().toString())
        _locationData.value = LocationData(lat, lng, alt, getCurrentDateTime())
        Log.d(TAG, "getLocation: " + _locationData.value)

    }

    private fun getCurrentDateTime(): Date {
        return Calendar.getInstance().time
    }

    fun setTimeSelected(time: Int){
        _timeSelected.value = time
    }

    private fun codeCreator(){
        val ran = (1000..9999).random()
        val string = ran.toString()
        val numbers = string.map { it.toString().toInt() }.toIntArray()
        _ranNumber.value = numbers
    }

}