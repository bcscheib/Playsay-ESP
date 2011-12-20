class PlaysController < ApplicationController
  layout 'default'

  def index
    @guess = @current_user.guesses.new
    @taboos = @current_user.guesses.where(:photo_src => 'http://www.mypartyplanner.com/images/pvsi/image1.jpg',
                                          :matched => true)
  end
end