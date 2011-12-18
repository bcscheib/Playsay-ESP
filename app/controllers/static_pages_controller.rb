class StaticPagesController < ApplicationController
  #protect_from_forgery
  layout 'default'

  def index

  end

  def start
    @guess = @current_user.guesses.new
  end
end