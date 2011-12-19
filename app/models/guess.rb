class Guess < ActiveRecord::Base
  belongs_to :user
  after_create :set_guess_matched, :set_paired_user_guess_matched
  attr_accessor :pair_passed

  private

  def set_matched
    if user.paired_user #paired user might have passed already
      paired_user_guesses = user.paired_user.guesses.where('photo_src = ? and body = ?', photo_src, body)
      unless paired_user_guesses.empty?
        self.matched = true
        user.add_points
        user.paired_user.add_points
      end
    else
      self.body = nil #paired user passed
      self.save
    end
    self.save
  end

  def set_paired_user_guess_matched
    if user.paired_user #paired user might have passed already
      paired_user_guesses = user.paired_user.guesses.where('photo_src = ? and body = ?', photo_src, body)
      paired_user_guesses.first.update_attributes(:matched => true)
    end
  end
end