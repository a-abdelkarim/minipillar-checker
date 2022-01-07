package com.example.getlocation

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Looper
import android.provider.Settings
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.lifecycle.ViewModelProvider
import com.example.getlocation.databinding.ActivityMainBinding
import com.google.android.gms.location.*
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity(), View.OnClickListener {
    //Declaring the needed Variables
    private val TAG = "MainActivity:"
    private lateinit var fusedLocationProviderClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private val PERMISSION_ID = 1010
    private lateinit var viewModel: MainViewModel
//    private lateinit var binding: MainActivity
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_main)

        //fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

//        binding = DataBindingUtil.setContentView(this, R.layout.activity_main)
////
//        binding.viewModel = viewModel

        viewModel = ViewModelProvider(this).get(MainViewModel::class.java)

        binding.viewModel = viewModel

        one_ImageView.setOnClickListener(this)
        three_ImageView.setOnClickListener(this)
        five_ImageView.setOnClickListener(this)
        seven_ImageView.setOnClickListener(this)

        viewModel.timeSelected.observe(this, {
            setSelectedView(it)
        })


        update_now_Button.setOnClickListener {
            requestPermission()
            getLastLocation()
            viewModel.isVerified.observe(this, {
                if (it) {
                    update_now_Button.text = getString(R.string.update_now)
                    viewModel.sendLocation()
                } else {
                    update_now_Button.text = getString(R.string.request_verification)
                    viewModel.requestVerification()
                }
            })

        }

        viewModel.result.observe(this, {
//            resultTextView.text = it.lat
        })

        viewModel.isSuccess.observe(this, {
            if (!it) {
//                Toast.makeText(this, "something went wrong, try again", Toast.LENGTH_SHORT).show()
                binding.errorTextView.text = "something went wrong, try again"

            }
        })

//        viewModel.isVerified.observe(this, {
//            if (it) {
//                verified()
//            } else{
//                notVerified()
//            }
//        })

    }

    private fun getLastLocation() {
        if (checkPermission()) {
            if (isLocationEnabled()) {
                newLocationData()
            } else {
                Toast.makeText(
                    applicationContext,
                    "Please Turn on Your device Location",
                    Toast.LENGTH_SHORT
                ).show()
                startActivity(Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS))
            }
        } else {
            requestPermission()
        }
    }

    private fun newLocationData() {
        locationRequest = LocationRequest.create()
        locationRequest.priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        locationRequest.interval = 0
        locationRequest.fastestInterval = 0
        locationRequest.numUpdates = 1
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this)
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermission()
            return
        }
        fusedLocationProviderClient.requestLocationUpdates(
            locationRequest, locationCallback, Looper.myLooper()
        )
    }


    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            val lastLocation: Location = locationResult.lastLocation
            Log.d(TAG, "onLocationResult: " + lastLocation.altitude.toString())
            viewModel.setLocation(
                lastLocation.latitude.toString(),
                lastLocation.longitude.toString(),
                lastLocation.altitude.toString()
            )

//            location_TextView.text = String.format(resources.getString(R.string.location_string),viewModel.locationData.value!!.lng,viewModel.locationData.value!!.lat)
//                "You Last Location is : Long: "+ lastLocation.longitude +
//                    " , Lat: " + lastLocation.latitude
        }
    }

    private fun checkPermission(): Boolean {
        //this function will return a boolean
        //true: if we have permission
        //false if not
        if (
            ActivityCompat.checkSelfPermission(
                applicationContext,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED ||
            ActivityCompat.checkSelfPermission(
                applicationContext,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            return true
        }

        return false

    }

    private fun requestPermission() {
        //this function will allows us to tell the user to requesut the necessary permsiion if they are not garented
        ActivityCompat.requestPermissions(
            this,
            arrayOf(
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION
            ),
            PERMISSION_ID
        )
    }

    private fun isLocationEnabled(): Boolean {
        //this function will return to us the state of the location service
        //if the gps or the network provider is enabled then it will return true otherwise it will return false
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(
            LocationManager.NETWORK_PROVIDER
        )
    }


    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        if (requestCode == PERMISSION_ID) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d("MainActivity:", "You have the Permission")
            }
        }
    }
    
    override fun onClick(v: View?) {
        when (v?.id) {
            one_ImageView.id -> {
                viewModel.setTimeSelected(1)
            }
            three_ImageView.id -> {
                viewModel.setTimeSelected(3)
            }
            five_ImageView.id -> {
                viewModel.setTimeSelected(5)
            }
            seven_ImageView.id -> {
                viewModel.setTimeSelected(7)
            }
        }
    }


    private fun setSelectedView(it: Int?) {
        when (it) {
            1 -> {
                one_ImageView.setBackgroundResource(R.drawable.option_selected_shadow)
                three_ImageView.background = null
                five_ImageView.background = null
                seven_ImageView.background = null
            }
            3 -> {
                three_ImageView.setBackgroundResource(R.drawable.option_selected_shadow)
                one_ImageView.background = null
                five_ImageView.background = null
                seven_ImageView.background = null
            }
            5 -> {
                five_ImageView.setBackgroundResource(R.drawable.option_selected_shadow)
                one_ImageView.background = null
                three_ImageView.background = null
                seven_ImageView.background = null
            }
            7 -> {
                seven_ImageView.setBackgroundResource(R.drawable.option_selected_shadow)
                one_ImageView.background = null
                three_ImageView.background = null
                five_ImageView.background = null
            }
        }
    }
//    private fun verified(){
//        update_interval_TextView.visibility = View.VISIBLE
//        inner_timer_LinearLayout.visibility = View.VISIBLE
//        inner_code_LinearLayout.visibility = View.GONE
//    }
//    private fun notVerified(){
//        update_interval_TextView.visibility = View.GONE
//        inner_timer_LinearLayout.visibility = View.GONE
//        inner_code_LinearLayout.visibility = View.VISIBLE
//    }
}
