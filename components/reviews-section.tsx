"use client"

import { Star } from 'lucide-react'

export function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "Brian Grant Rogers",
      text: "Got three quotes and yes I got a great deal! Fair pricing and perfect execution! Thank you",
      rating: 5,
      avatar: "/images/placeholder-user.jpg"
    },
    {
      id: 2,
      name: "Miguel Di Salvia",
      text: "Simple, not complicated. Very friendly. 100% transparent and available. Comprehensive information. I highly recommend them.",
      rating: 5,
      avatar: "/images/placeholder-user.jpg"
    },
    {
      id: 3,
      name: "Julian Budileanu",
      text: "It's Super! With 0 construction knowledge, this was the simplest and fastest way to connect with roofing companies.",
      rating: 5,
      avatar: "/images/placeholder-user.jpg"
    }
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/heroimage.jpg')`
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why American Homeowners Trust Us
          </h2>
          <p className="text-xl text-gray-200 mb-6">
            Discover what our customers have to say about our services and expertise
          </p>
          
          {/* Google Reviews Badge */}
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-flex">
            <div className="flex items-center space-x-1">
              <span className="text-white font-semibold">Google</span>
              <span className="text-blue-400 font-bold">Reviews</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white font-semibold">4.9/5</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="text-orange-400 text-4xl font-serif mb-4">"</div>
              
              {/* Review Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {review.text}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{review.name}</h4>
                  <p className="text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Satisfied Customers
            </h3>
            <p className="text-gray-200 mb-6">
              Over 1,200+ homeowners have trusted our platform for their roofing projects
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Get My Free Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
