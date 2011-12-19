class PlaysController < ApplicationController
  layout 'default'

  def index
    @guess = @current_user.guesses.new
  end
end