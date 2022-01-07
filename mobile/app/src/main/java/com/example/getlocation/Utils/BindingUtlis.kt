package com.example.getlocation.Utils

import android.widget.ImageView
import androidx.databinding.BindingAdapter
import com.example.getlocation.R

@BindingAdapter("codeImage")
fun ImageView.setCodeImage(code: Int) {
    setImageResource(
        when (code) {
            0 -> R.drawable.zero
            1 -> R.drawable.one
            2 -> R.drawable.two
            3 -> R.drawable.three
            4 -> R.drawable.four
            5 -> R.drawable.five
            6 -> R.drawable.six
            7 -> R.drawable.seven
            8 -> R.drawable.eight
            9 -> R.drawable.nine
            else -> R.drawable.ic_error
        }
    )
}